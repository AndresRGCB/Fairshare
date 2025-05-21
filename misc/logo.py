from PIL import Image, ImageDraw, ImageFont

# Set up the canvas with transparency (RGBA mode)
width, height = 550, 150
image = Image.new("RGBA", (width, height), (255, 255, 255, 0))  # Transparent background

# Set up drawing context
draw = ImageDraw.Draw(image)

# Define the font and size
font_path = "C:/Windows/Fonts/BRLNSDB.ttf"  # Use a valid font path
font_size = 100
font = ImageFont.truetype(font_path, font_size)

# Define the text and color
text = "FairShare"
text_color = "#ffffff"

# Calculate text position to center it
text_bbox = draw.textbbox((0, 0), text, font=font)
text_width, text_height = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
text_x = (width - text_width) // 2
text_y = (height - text_height) // 2

# Draw the main text
draw.text((text_x, text_y), text, font=font, fill=text_color)

# Add the ® symbol as superscript
symbol_font_size = int(font_size * 0.4)  # Smaller font for the ® symbol
symbol_font = ImageFont.truetype(font_path, symbol_font_size)
symbol_text = "®"

# Position the ® symbol as a superscript
symbol_x = text_x + text_width + 3  # Slightly to the right of the main text
symbol_y = text_y - (font_size * 0.05)  # Slightly above the top-right corner of the text
draw.text((symbol_x, symbol_y), symbol_text, font=symbol_font, fill=text_color)

# Save the image with transparency
output_path = "logo_white.png"
image.save(output_path)
print(f"Logo saved at {output_path}")
