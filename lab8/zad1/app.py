from flask import Flask

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    print("Hello!")
    return "Hello!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)