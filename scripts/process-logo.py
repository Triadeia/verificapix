from pathlib import Path

from PIL import Image


SOURCE = Path("/Volumes/SSD-Nilton/verifica PIX.png")
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "logo"


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = pixels[x, y]
            minimum = min(red, green, blue)
            maximum = max(red, green, blue)
            neutrality = maximum - minimum
            brightness = (red + green + blue) / 3

            if neutrality < 28 and brightness > 105:
                alpha = 0
            elif neutrality < 40 and brightness > 180:
                alpha = int(max(0, 255 - ((brightness - 180) / 50) * 255))
            else:
                alpha = 255
            pixels[x, y] = (red, green, blue, alpha)
    return rgba


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if box is None:
        raise RuntimeError("Logo content was not detected.")
    left, top, right, bottom = box
    padding = 24
    return (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )


def recolor(image: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    result = Image.new("RGBA", image.size, (*color, 0))
    result.putalpha(image.getchannel("A"))
    return result


OUTPUT.mkdir(parents=True, exist_ok=True)
clean = remove_background(Image.open(SOURCE))
clean = clean.crop(content_box(clean))
clean.save(OUTPUT / "verificapix-francy.png", optimize=True)
recolor(clean, (244, 248, 245)).save(
    OUTPUT / "verificapix-francy-white.png", optimize=True
)
recolor(clean, (7, 52, 92)).save(
    OUTPUT / "verificapix-francy-navy.png", optimize=True
)

print(f"Created logo assets in {OUTPUT}")
