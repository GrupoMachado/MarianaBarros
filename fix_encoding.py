import os

with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

try:
    # Attempt to decode double UTF-8
    fixed = text.encode("latin1").decode("utf-8")
except Exception as e:
    print("Could not reverse double encoding:", e)
    fixed = text

with open("index_fixed.html", "w", encoding="utf-8") as f:
    f.write(fixed)
print("Done")
