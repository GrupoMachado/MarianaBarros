import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract Babel script
babel_match = re.search(r'<script type="text/babel">(.*?)</script>', content, flags=re.DOTALL)
if not babel_match:
    print("Babel script not found")
    exit(1)

babel_code = babel_match.group(1)

# Modify babel code to be a valid module
# Replace ReactDOM.createRoot(...) with export default App or just keep it there for main.jsx
babel_code = "import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';\nimport ReactDOM from 'react-dom/client';\n" + babel_code

# Remove 'const { useState ... } = React;'
babel_code = re.sub(r'const\s*{\s*useState[^}]*}\s*=\s*React;', '', babel_code)

with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(babel_code)

# Now modify index.html
# Remove react, react-dom, babel CDNs
new_content = re.sub(r'<script crossorigin src="https://unpkg\.com/react@18.*?</script>\s*', '', content)
new_content = re.sub(r'<script crossorigin src="https://unpkg\.com/react-dom@18.*?</script>\s*', '', new_content)
new_content = re.sub(r'<script crossorigin src="https://unpkg\.com/@babel/standalone.*?</script>\s*', '', new_content)

# Replace the babel script with the module import
new_content = re.sub(r'<script type="text/babel">.*?</script>', '<script type="module" src="/src/main.jsx"></script>', new_content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Extraction successful!")
