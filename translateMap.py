from PIL import Image

# Load the image
img = Image.open('map.png').convert('RGB')
width, height = img.size

matrix = []
for y in range(height):
    row = []
    for x in range(width):
        r, g, b = img.getpixel((x, y))
        if (r, g, b) == (0, 0, 0):
            row.append(0)
        elif (r, g, b) == (255, 0, 0):
            row.append(1) # Wall
        elif (r, g, b) == (0, 0, 255):
            row.append(3) # consumable
        elif (r, g, b) == (0, 255, 0):
            row.append(4) # power-up
        else:
            row.append(0)  # Default to 0 for other colors
    matrix.append(row)

# Format as JavaScript variable
js_matrix = "var gameMap = [\n"
for row in matrix:
    js_matrix += "  [" + ", ".join(map(str, row)) + "],\n"
js_matrix += "];\n"

with open('map.js', 'w') as f:
    f.write(js_matrix)

print("map.js generated.")