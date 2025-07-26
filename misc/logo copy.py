from PIL import Image, ImageDraw, ImageFont


# Set up the canvas for a favicon (e.g., 64x64 pixels)
width, height = 64, 64
image = Image.new("RGBA", (width, height), (255, 255, 255, 0))  # Transparent background

# Set up drawing context
draw = ImageDraw.Draw(image)

# Define the font and size
font_path = "C:/Windows/Fonts/BRLNSDB.ttf"  # Replace with a valid font path
font_size = 42  # Adjust font size to fit within the small canvas
font = ImageFont.truetype(font_path, font_size)

# Define the text and color
text = "FS"
text_color = "#012a8e"

# Calculate text position to center it
text_bbox = draw.textbbox((0, 0), text, font=font)
text_width, text_height = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
text_x = (width - text_width) // 2
text_y = (height - text_height) // 2

# Draw the main text
draw.text((text_x, text_y), text, font=font, fill=text_color)

# Save the favicon image
output_path = "favicon.png"
image.save(output_path)
print(f"Favicon saved at {output_path}")
