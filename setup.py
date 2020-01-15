#!/usr/bin/env python

from setuptools import find_packages, setup

setup(
    name="music-database",
    use_scm_version=True,
    packages=find_packages(),
    python_requires=">=3.6",
    setup_requires=["setuptools_scm"],
    install_requires=[
        "Django>=2",
        "dj-database-url",
        "djangorestframework",
        "markdown",
        "django-filter",
    ],
    extras_require={"psycopg": ["psycopg2"]},
    scripts=["manage.py"],
)
