import os
import re

replacements = [
    (r'#050505', r'var(--color-bg)'),
    (r'#0d0d0d', r'var(--color-bg-elevated)'),
    (r'#ffffff', r'var(--color-text)'),
    (r'#fff\b', r'var(--color-text)'),
    (r'#D4AF7A', r'var(--color-accent)'),
    (r'rgba\(255,\s*255,\s*255,', r'rgba(var(--color-rgb-text),'),
    (r'rgba\(212,\s*175,\s*122,', r'rgba(var(--color-rgb-accent),'),
    (r'rgba\(5,\s*5,\s*5,', r'rgba(var(--color-rgb-bg),'),
    (r'rgba\(\s*0,\s*0,\s*0,\s*([0-9.]+)\s*\)', r'rgba(var(--color-rgb-bg),\1)'),
]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    orig = content
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content, flags=re.IGNORECASE)
        
    if content != orig:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('/Users/home/Desktop/SNITCH/Frontend/src'):
    for file in files:
        if file.endswith('.scss'):
            process_file(os.path.join(root, file))
