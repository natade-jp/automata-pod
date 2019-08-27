#!/bin/sh

YOMI=./dict/hello.yomi
PHONE=./dict/hello.phone
yomi2voca.pl ${YOMI} > ${PHONE}

# mkdfa.pl ./dict/hello
