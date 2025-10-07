from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import io

app = Flask(__name__)

print("⏳ Loading BLIP model...")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
print("✅ Model loaded!")

@app.route("/caption", methods=["POST"])
def caption():
    try:
        print("🖼️ Received image data of size:", len(request.data))
        image = Image.open(io.BytesIO(request.data)).convert("RGB")
        print("✅ Image loaded")
        
        inputs = processor(image, return_tensors="pt")
        print("🧠 Generating caption...")
        output = model.generate(**inputs, max_new_tokens=20)
        caption = processor.decode(output[0], skip_special_tokens=True)
        print("💬 Caption generated:", caption)
        
        return jsonify({"generated_text": caption})
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=5001)
