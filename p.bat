@echo off

bash -c '. g $0; echo git push; git push' %1
