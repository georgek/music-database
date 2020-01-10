from django.test import TestCase


class PassingTest(TestCase):
    def test_pass(self):
        self.assertTrue(True)
