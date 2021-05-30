
from . import util

THRESHOLD = 0.9

class CorrelatedFeatures:
    """a pair of correelated features"""
    def __init__(self):
        pass

class RegressionAnomalyDetector:
    """Anomaly detector based on regression line"""

    def __init__(self, column_by_name):
        """initialize the detector (not learn yet)

        Args:
            column_by_name (dictionary: string -> list of floats): a normal timeseries to learn from, maps a feature name to its column values
        """
        self._column_by_name = column_by_name
        self._learned = False

    def learn_normal(self):
        """learn the normal timeseries"""

        self._learned = True
        self._correlated_features = []

        # initiate threshold
        self._threshold = THRESHOLD

        # find the correlated feature of each feature
        for feature1 in self._column_by_name:
            max = 0
            max_att = None

            # find the feature with the highet pearson
            for feature2 in self._column_by_name:
                if feature2 == feature1:
                    continue

                p = abs(util.pearson(self._column_by_name[feature1], self._column_by_name[feature2]))
                if p > max:
                    max = p
                    max_att = feature2

            dup = False
            # check that this is not a duplicate
            for cf in self._correlated_features:
                if (cf.feature1 == feature1 and cf.feature2 == max_att) or (cf.feature1 == max_att and cf.feature2 == feature1):
                    dup = True

            if dup or max_att is None:
                continue

            c = CorrelatedFeatures()
            c.feature1 = feature1
            c.feature2 = max_att
            c.corrlation = max
            points = [util.Point(self._column_by_name[feature1][i], self._column_by_name[max_att][i]) for i in range(len(self._column_by_name[feature1]))]
            c.lin_reg = util.linear_reg(points)
            c.threshold = self._find_threshold(points, c.lin_reg) * 1.1; # 10% increase
            self._correlated_features.append(c)

    def detect(self, timeseries):
        """detect anomalies in timeseries

        Args:
            timeseries (dictionary: string -> list of floats): a timeseries to detect from, maps a feature name to its column values

        Returns:
            dictionary, represents ANOMALY JSON in the format
            of: { col_name_1: [1,3...], col_name_2: [1,5...] ....}
        """
        res = {}
        for feature in self._column_by_name:
            res[feature] = []


        for cor in self._correlated_features:
            f1_values = timeseries[cor.feature1]
            f2_values = timeseries[cor.feature2]

            for i in range(len(f1_values)):
                if self._is_anomalous(f1_values[i], f2_values[i], cor):
                    res[cor.feature1].append(i)
                    res[cor.feature2].append(i)
        return res

    def get_model(self):
        res = ''
        for cf in self._correlated_features:
            res += f'{cf.feature1}-{cf.feature2}\n'

        return res

    def _find_threshold(self, points, line):
        max = 0
        for p in points:
            d = abs(p.y - line.calc(p.x))
            if d > max:
                max = d

        return max

    def _is_anomalous(self, x, y, cf):
        """check if point is anomalous

        Args:
            x (int): value of the first feature
            y (int): value of the second feature
            cf (CorrelatedFeatures): information about the correlated features

        Returns:
            boolean: whether the point is anomalous
        """
        return cf.corrlation > self._threshold and abs(y - cf.lin_reg.calc(x)) > cf.threshold