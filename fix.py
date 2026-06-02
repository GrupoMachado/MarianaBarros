import codecs
with codecs.open('index.html', 'r', 'utf-8') as f:
    text = f.read()

start_idx = text.find('function App() {')
end_marker = "                        </>);\r\n                                        case 'treinos':"
end_idx = text.find(end_marker, start_idx)

if end_idx == -1:
    end_marker = "                        </>);\n                                        case 'treinos':"
    end_idx = text.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    with codecs.open('fix.txt', 'r', 'utf-8') as f2:
        replacement = f2.read()
        
    part2 = text[end_idx + len(end_marker):]
    new_text = text[:start_idx] + replacement + "\n" + "                                        case 'treinos':" + part2

    with codecs.open('index.html', 'w', 'utf-8') as f:
        f.write(new_text)
    print("SUCCESS")
else:
    print("FAILED TO FIND MARKERS", start_idx, end_idx)
