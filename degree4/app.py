from flask import Flask, render_template

from calculator import *


app = Flask(__name__)

@app.route("/<expr>")
def calculate(expr):
    return render_template("calculator_result.html",x1=parse(expr)[0][0],x2=parse(expr)[0][1],x3=parse(expr)[0][2],x4=parse(expr)[0][3],x1n=parse(expr)[1][0],x2n=parse(expr)[1][1],x3n=parse(expr)[1][2],x4n=parse(expr)[1][3])


app.run()
