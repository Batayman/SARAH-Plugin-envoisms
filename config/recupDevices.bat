@echo off
title Recuperation des devices Pushbullet
mode con cols=50 lines=20
color 70

:accessToken
set /p token=Colle ton access-token : 
if "%token%" equ "" ( 
GOTO accessToken )

curl --header "Access-Token: %token%" https://api.pushbullet.com/v2/devices > devices.json
pause