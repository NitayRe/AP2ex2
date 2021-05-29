import math

class Line:
    """ Represents a line"""
    def __init__(self, m, b):
        """Constructs a line in the form of m*x+b"""
        self.m = m
        self.b = b

    def calc(self, x):
        """Calculate the value of the function at value x"""
        return self.m * x + self.b

class Point:
    """ Represents a point"""
    def __init__(self, x, y):
        """Constructs the point (x,y)"""
        self.x = x
        self.y = y

    def dist(self, other):
        """Calculate distance from another point"""
        return math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)
           
def avg(values):
    """Calculate the average for set of float values"""
    sum = 0
    for x in values:
        sum += x

    return sum / len(values)

def var(values):
    """Calculate the variance for set of float values"""
    av = avg(values)
    sum = 0
    for x in values:
        sum += x * x

    return sum / len(values) - av * av


def cov(values1, values2):
    """Calculate the covariance between two sets of float values"""
    sum = 0
    for i in range(len(values1)):
        sum += values1[i] * values2[i]

    sum /= len(values1)
    return sum - avg(values1) * avg(values2)



def pearson(values1, values2):
    """Calculate the Pearson correlation coefficient between two sets of float values"""
    a = (math.sqrt(var(values1)) * math.sqrt(var(values2)))
    if a == 0:
        return 0
    return cov(values1, values2) / a

def linear_reg(points):
    """performs a linear regression

    Args:
        points (list of Point): points to do regression out of

    Returns:
        Line: the linear regression line
    """
    x_values = [p.x for p in points]
    y_values = [p.y for p in points]
    
    v = var(x_values)
    if v == 0:
        m = 0
    else:
        m = cov(x_values, y_values) / v
    b = avg(y_values) - m * (avg(x_values))

    return Line(m, b)


def dev(p, points):
    """Calculate the deviation between point p and the line equation of the points"""
    line = linear_reg(points)
    return abs(p.y - line.calc(p.x))
