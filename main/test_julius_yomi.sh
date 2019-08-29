#!/bin/sh

YOMI=./dict/pod.yomi
PHONE=./dict/pod.phone
yomi2voca.pl ${YOMI} > ${PHONE}

# mkdfa.pl ./dict/pod
