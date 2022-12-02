from sympy import *

def Sqrt(a):
    return sqrtdenest(sqrt(a))
def Cbrt(a):
    if a>=0:
        return cbrt(a)
    return -Cbrt(-a)
def parse(expr):
    expr=expr.replace('÷','/')
    coeff=expr.split(';')
    a,b,c,d,e=parse_expr(coeff[0]),parse_expr(coeff[1]),parse_expr(coeff[2]),parse_expr(coeff[3]),parse_expr(coeff[4])
    D=3*b**2-8*a*c
    E=b**3-4*a*b*c+8*a**2*d
    F=3*b**4+16*a**2*c**2-16*a*b**2*c+16*a**2*b*d-64*a**3*e
    A=D**2-3*F
    B=D*F-9*E**2
    C=F**2-3*D*E**2
    delta=B**2-4*A*C
    if D==E==F==0:
        x1=x2=x3=x4=-b/(4*a)
    if D*E*F!=0 and A==B==C==0:
        x1=(-b*D-9*E)/(4*a*D)
        x2=x3=x4=(-b*D+3*E)/(4*a*D)
    if D!=0 and E==F==0:
        if D>0:
            x1=x2=(-b+Sqrt(D))/(4*a)
            x3=x4=(-b-Sqrt(D))/(4*a)
        if D<0:
            x1=x2=-b/(4*a)+Sqrt(-D)/(4*a)*I
            x3=x4=-b/(4*a)-Sqrt(-D)/(4*a)*I
    if A*B*C!=0 and delta==0:
        if B>0:
            x1=(-b-2*A*E/B+Sqrt(2*B/A))/(4*a)
            x2=(-b-2*A*E/B-Sqrt(2*B/A))/(4*a)
        if B<0:
            x1=(-b-2*A*E/B)/(4*a)+Sqrt(-2*B/A)/(4*a)*I
            x2=(-b-2*A*E/B)/(4*a)-Sqrt(-2*B/A)/(4*a)*I
        x3=x4=(-b+2*A*E/B)/(4*a)
    if delta>0:
        if E==0:
            x1=(-b+Sqrt(D+2*Sqrt(F)))/(4*a)
            x2=(-b-Sqrt(D+2*Sqrt(F)))/(4*a)
            x3=-b/(4*a)+Sqrt(-D+2*Sqrt(F))/(4*a)*I
            x4=-b/(4*a)-Sqrt(-D+2*Sqrt(F))/(4*a)*I
        if E!=0:
            z1 = expand(A * D + 3 * (-B + Sqrt(delta)) / 2)
            z2 = expand(A * D + 3 * (-B - Sqrt(delta)) / 2)
            z = expand(D ** 2 - D * (Cbrt(z1) + Cbrt(z2)) + (Cbrt(z1) + Cbrt(z2)) ** 2 - 3 * A)
            x1 = (-b - sign(E) * Sqrt((D + Cbrt(z1) + Cbrt(z2)) / 3) + Sqrt(
                (2 * D - Cbrt(z1) - Cbrt(z2) + 2 * Sqrt(z)) / 3)) / (4 * a)
            x2 = (-b - sign(E) * Sqrt((D + Cbrt(z1) + Cbrt(z2)) / 3) - Sqrt(
                (2 * D - Cbrt(z1) - Cbrt(z2) + 2 * Sqrt(z)) / 3)) / (4 * a)
            x3 = (-b + sign(E) * Sqrt((D + Cbrt(z1) + Cbrt(z2)) / 3)) / (4 * a) + Sqrt(
                (-2 * D + Cbrt(z1) + Cbrt(z2) + 2 * Sqrt(z)) / 3) / (4 * a) * I
            x4 = (-b + sign(E) * Sqrt((D + Cbrt(z1) + Cbrt(z2)) / 3)) / (4 * a) - Sqrt(
                (-2 * D + Cbrt(z1) + Cbrt(z2) + 2 * Sqrt(z)) / 3) / (4 * a) * I
    if delta < 0:
        if E == 0:
            if D > 0 and F > 0:
                x1 = (-b + Sqrt(D + 2 * Sqrt(F))) / (4 * a)
                x2 = (-b - Sqrt(D + 2 * Sqrt(F))) / (4 * a)
                x3 = (-b + Sqrt(D - 2 * Sqrt(F))) / (4 * a)
                x4 = (-b - Sqrt(D - 2 * Sqrt(F))) / (4 * a)
            if D < 0 and F > 0:
                x1 = -b / (4 * a) + Sqrt(-D + 2 * Sqrt(F)) / (4 * a) * I
                x2 = -b / (4 * a) - Sqrt(-D + 2 * Sqrt(F)) / (4 * a) * I
                x3 = -b / (4 * a) + Sqrt(-D - 2 * Sqrt(F)) / (4 * a) * I
                x4 = -b / (4 * a) - Sqrt(-D - 2 * Sqrt(F)) / (4 * a) * I
            if F < 0:
                x1 = (-2 * b + Sqrt(2 * D + 2 * Sqrt(A - F))) / (8 * a) + (Sqrt(-2 * D + 2 * Sqrt(A - F))) / (
                            8 * a) * I
                x2 = (-2 * b + Sqrt(2 * D + 2 * Sqrt(A - F))) / (8 * a) - (Sqrt(-2 * D + 2 * Sqrt(A - F))) / (
                            8 * a) * I
                x3 = (-2 * b - Sqrt(2 * D + 2 * Sqrt(A - F))) / (8 * a) + (Sqrt(-2 * D + 2 * Sqrt(A - F))) / (
                            8 * a) * I
                x4 = (-2 * b - Sqrt(2 * D + 2 * Sqrt(A - F))) / (8 * a) - (Sqrt(-2 * D + 2 * Sqrt(A - F))) / (
                            8 * a) * I
        if E != 0:
            theta = acos((3 * B - 2 * A * D) / (2 * A * Sqrt(A)))
            y1 = (D - 2 * Sqrt(A) * cos(theta / 3)) / 3
            y2 = (D + Sqrt(A) * (cos(theta / 3) + Sqrt(3) * sin(theta / 3))) / 3
            y3 = (D + Sqrt(A) * (cos(theta / 3) - Sqrt(3) * sin(theta / 3))) / 3
            if D > 0 and F > 0:
                x1 = (-b - sign(E) * Sqrt(y1) + Sqrt(y2) + Sqrt(y3)) / (4 * a)
                x2 = (-b - sign(E) * Sqrt(y1) - Sqrt(y2) - Sqrt(y3)) / (4 * a)
                x3 = (-b + sign(E) * Sqrt(y1) + Sqrt(y2) - Sqrt(y3)) / (4 * a)
                x4 = (-b + sign(E) * Sqrt(y1) - Sqrt(y2) + Sqrt(y3)) / (4 * a)
            if min(D, F) <= 0:
                x1 = (-b - Sqrt(y2)) / (4 * a) + (sign(E) * Sqrt(-y1) - Sqrt(-y3)) / (4 * a) * I
                x2 = (-b - Sqrt(y2)) / (4 * a) - (sign(E) * Sqrt(-y1) - Sqrt(-y3)) / (4 * a) * I
                x3 = (-b + Sqrt(y2)) / (4 * a) + (sign(E) * Sqrt(-y1) + Sqrt(-y3)) / (4 * a) * I
                x4 = (-b + Sqrt(y2)) / (4 * a) - (sign(E) * Sqrt(-y1) + Sqrt(-y3)) / (4 * a) * I
    return [[latex(expand(x1)),latex(expand(x2)),latex(expand(x3)),latex(expand(x4))],[latex(expand(x1.n(32))),latex(expand(x2.n(32))),latex(expand(x3.n(32))),latex(expand(x4.n(32)))]]
def quadratic(a, b, c):
    a=parse_expr(a)
    b=parse_expr(b)
    c=parse_expr(c)

    delta = b ** 2 - 4 * a * c

    x_1 = (-b + Sqrt(delta)) / (2 * a)
    x_2 = (-b - Sqrt(delta)) / (2 * a)
    return x_1, x_2



if __name__ == '__main__':
    main()
