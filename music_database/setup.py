#!/usr/bin/env python

from setuptools import setup, find_packages

setup(
    name="music-database",
    use_scm_version={"root": "..", "relative_to": __file__},
    packages=find_packages(),
    python_requires=">=3.6",
    setup_requires=["setuptools_scm"],
    install_requires=[
        "Django>=2",
        "dj-database-url",
        "djangorestframework",
        "markdown",
        "django-filter",
        "django-cors-headers",
    ],
    extras_require={"psycopg": ["psycopg2"]},
    scripts=["manage.py"],
)
