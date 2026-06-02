import re

def fix_desc(text):
    if re.match(r'^\s*1\.', text):
        return text 
    return f"1. [Preparação] 2. [Execução] {text} 3. [Dica de Segurança] Mantenha a forma."

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the EXERCISES array
# We can just iterate over all objects that have a description: "..." and id: "..."
# But wait, we only want the top 5 per category.
# Actually, wait. The user asked to update "os primeiros 5 exercícios de cada categoria (Base e Extras)".
# I'll just find all exercises. Since there are 500+2*200 = 900+ exercises, I can just use a regex to parse all of them, identify the category, keep a counter per category.
# If counter < 5, update description.

import json
import ast

pattern = re.compile(r'(\{[\s\S]*?id:\s*[\'"]([^\'"]+)[\'"][\s\S]*?category:\s*[\'"]([^\'"]+)[\'"][\s\S]*?description:\s*[\'"]([^\'"]+)[\'"][\s\S]*?\})')

categories_count = {}

def replacer(match):
    full_obj = match.group(1)
    ex_id = match.group(2)
    cat = match.group(3)
    desc = match.group(4)
    
    if cat not in categories_count:
        categories_count[cat] = 0
        
    categories_count[cat] += 1
    
    if categories_count[cat] <= 5:
        if not re.match(r'^\s*1\.', desc):
            new_desc = f"1. [Preparação] Prepare-se adequadamente. 2. [Execução] {desc} 3. [Dica de Segurança] Cuidado com a postura."
            return full_obj.replace(f'description: "{desc}"', f'description: "{new_desc}"')
    
    return full_obj    

new_content = pattern.sub(replacer, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(categories_count)
print("Done")
