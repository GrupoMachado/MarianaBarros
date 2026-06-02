import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Gin\u00C3\u00A1stica', 'Ginástica')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Encoding fixed.")
