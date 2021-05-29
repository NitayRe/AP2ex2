import math
from . import util

class Circle:
    """ Represents a circle"""
    def __init__(self, center, radius):
        """Constructs a circle by its center and radius"""
        self.center = center
        self.radius = radius

    @classmethod
    def _from_2_points(cls, p1, p2):
        x = (p1.x + p2.x) / 2
        y = (p1.y + p2.y) / 2
        r = p1.dist(p2) / 2
        return Circle(util.Point(x,y), r)

    @classmethod
    def _from_3_points(cls, p1, p2, p3):
        m12 = util.Point((p1.x+p2.x)/ 2 , (p1.y + p2.y) / 2) # mid point of line p1p2
        slop12 = (p2.y - p1.y) / (p2.x - p1.x) # the slop of AB
        pSlop12 = -1 / slop12 # the perpendicular slop of AB

        m23 = util.Point((p2.x+p3.x)/ 2 , (p2.y + p3.y) / 2) # mid point of line BC
        slop23 = (p3.y - p2.y) / (p3.x - p2.x) # the slop of BC
        pSlop23 = -1 / slop23 # the perpendicular slop of BC


        x = (-pSlop23 * m23.x + m23.y + pSlop12 * m12.x - m12.y) / (pSlop12 - pSlop23)
        y = pSlop12 * (x - m12.x) + m12.y
        center = util.Point(x, y)
        R = center.dist(p1)

        return Circle(center, R)

    @classmethod
    def _trivial(cls, points):
        if len(points) == 0:
            return Circle(util.Point(0,0), 0)
        elif len(points) == 1:
            return Circle(points[0], 0)
        elif len(points) == 2:
            return Circle._from_2_points(points[0], points[1])

        # maybe 2 of the points define a small circle that contains the 3rd point
        c = Circle._from_2_points(points[0], points[1])
        if points[2].dist(util.Point(c.center.x, c.center.y)) <= c.radius:
            return c
        c = Circle._from_2_points(points[0], points[2])
        if points[1].dist(util.Point(c.center.x, c.center.y)) <= c.radius:
            return c
        c = Circle._from_2_points(points[1], points[2])
        if points[0].dist(util.Point(c.center.x, c.center.y)) <= c.radius:
            return c

        # else find the unique circle from 3 points
        return Circle._from_3_points(points[0], points[1], points[2])

    @classmethod
    def _welzl(cls, P, R):
        if len(P) or len(R) == 3:
            return Circle._trivial(R)

        # remove random point p
        i = len(P) - 1
        p = P.pop()

        c = Circle._welzl(P, R);

        if p.dist(c.center) <= c.radius:
            return c

        R.Add(p)

        return Circle._welzl(P, R)

    @classmethod
    def findMinCircle(cls, points):
        return Circle._welzl(points.copy(), [])
