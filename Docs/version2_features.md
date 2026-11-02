Technical Blueprint: Embedding-Powered E-Commerce Search1. Understanding Embedding Model SizesWhen evaluating embedding models, "size" refers to two distinct metrics: Output Vector Dimensions and Model Parameter Size.Output Vector Dimensions (Vector Length)This determines the accuracy and granularity of the text representation:Small (384 dimensions): Built for speed and edge devices (e.g., all-MiniLM-L6-v2).Standard (768 to 1,024 dimensions): The industry baseline balance of performance and size (e.g., BGE-M3, EmbeddingGemma).Large (1,536 to 3,072 dimensions): Premium accuracy used by flagship commercial APIs (e.g., OpenAI text-embedding-3-small / -large).Model Parameter Size (Memory Footprint)This determines the physical hardware requirements to host the model:Tiny (~100M–300M parameters): Runs easily on lightweight standard CPUs.Normal (~300M–800M parameters): The production sweet spot, requiring 1GB to 3GB of RAM/VRAM.Large (1B+ parameters): Heavy-duty setups used for massive multilingual or long-context systems.2. Infrastructure: Cloud API vs. Self-HostingText embedding models are lightweight compared to LLMs, making self-hosting highly viable. Choosing between a Cloud API (e.g., OpenAI, Cohere) and Self-Hosting (e.g., running open-source models via ONNX or Hugging Face) depends on key trade-offs:Architectural FeatureCloud API ApproachSelf-Hosted ApproachSetup SpeedInstant. Connect via a simple API key.Days/Weeks. Requires Docker/Kubernetes setups.Data PrivacyLower. Data is sent to third-party networks.Maximum. Zero-trust; data stays local.Query LatencyHigher (100–300ms). Network round-trips apply.Ultra-low (10–50ms). Model sits next to the DB.Cost StructurePay-per-token. High cost if re-indexing often.Fixed server cost. Free to run trillions of vectors.MaintenanceZero. The vendor manages everything.High. Internal team manages load balancing.3. E-Commerce Implementation: Hybrid SearchModern e-commerce standardizes on Hybrid Search (pioneered by companies like Amazon) because pure vector search fails on mechanical lookups like specific SKUs or brand numbers, while pure keyword search fails on human intent.The System PipelineIngestion: Combine text attributes ("Brand: X \| Title: Y \| Specs: Z") into a text block, run it through the embedding model, and store the resulting array inside a vector-supported database (e.g., PostgreSQL + pgvector, Elasticsearch, or MongoDB).Runtime Query: The user enters a search term, the backend converts that term into a query vector using the same model, and queries the database.Score Fusion: The system blends the Keyword Score (BM25) and the Vector Score (Semantic) using Reciprocal Rank Fusion (RRF) to output perfectly balanced results.Re-Ranking: A final business logic layer adjusts the sorting based on margins, sponsored placement, stock levels, and user personalization.4. High-Performance Infinite Scroll via the Cursor ApproachTo prevent the heavy database degradation that happens when using traditional SQL OFFSET pagination with vectors, the Cursor Approach passes the similarity score of the last visible item back to the database as a relative reference point.Backend Routing Logic (Node.js Example)javascriptapp.get('/api/search', async (req, res) => {
  const { query, cursor } = req.query; // 'cursor' is the float score of the last item
  const limit = 20;
  const MINIMUM_RELEVANCE = 0.70;      // Safety fallback threshold

  // 1. Convert user's text query into a vector array
  const queryVector = await getEmbedding(query); 

  let dbQuery;
  let queryParams;

  if (!cursor) {
    // --- FIRST PAGE LOAD ---
    dbQuery = `
      SELECT id, title, price, image_url, 
             (1 - (embedding <=> $1)) AS similarity_score
      FROM products
      ORDER BY similarity_score DESC
      LIMIT $2;
    `;
    queryParams = [queryVector, limit];
  } else {
    // --- SUBSEQUENT SCROLL LOADS ---
    dbQuery = `
      SELECT id, title, price, image_url, 
             (1 - (embedding <=> $1)) AS similarity_score
      FROM products
      WHERE (1 - (embedding <=> $1)) < $2
      ORDER BY similarity_score DESC
      LIMIT $3;
    `;
    queryParams = [queryVector, parseFloat(cursor), limit];
  }

  const results = await db.query(dbQuery, queryParams);
  const lastItem = results[results.length - 1];
  
  // 2. Evaluate relevance threshold and extract the next cursor
  let nextCursor = lastItem ? lastItem.similarity_score : null;
  if (lastItem && lastItem.similarity_score < MINIMUM_RELEVANCE) {
    nextCursor = null; // Forces frontend to stop scrolling infinitely into irrelevant inventory
  }

  res.json({
    products: results,
    nextCursor: nextCursor
  });
});
Use code with caution.The Infinite Scroll LoopStep 1: Frontend requests page 1. Backend returns 20 items and sets nextCursor: 0.845.Step 2: Frontend displays items. User hits screen bottom.Step 3: Frontend requests page 2 sending the cursor parameter (cursor=0.845).Step 4: Database instantly skips everything scored above 0.845 and pulls the next 20 items.Step 5: Loop continues until the score drops below 0.70, clearing the cursor and triggering a "No more products found" state.Would you like to build out the SQL query for the hybrid search next, combining this pgvector logic with an exact text matching match (like full-text search)?