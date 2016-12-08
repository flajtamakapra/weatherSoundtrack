#!/usr/bin/env python
import requests
import os as os
import time as t
import subprocess
import signal
from os import path


from pprint import pprint


#********************************************
# Creating file with weather informations:
# based on the current date
def createFile(name, content, out):

	f = open(name,'w')
	j = 0

	if out == 1:
		for i in content['list']:
			a = str(j) + ' ' + str(i['main']['temp'])
			f.write(a + '\n')
			j+=1
	# for future use
	elif out == 2:
		for i in content['list']:
			a = str(j) + ' ' + str(i['wind']['speed'])
			f.write(a + '\n')
			j+=1

	f.close()

	
#*********************************************

def main():
	city = "montreal"
	response = requests.get("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=921b14e1b243b69d055d247137a8b285&units=metric")
	weather = response.json()
	date  = t.localtime(t.time())
	todayDate = '%d_%d' % (date[1],date[2])


	# os.rename(oldName, name)

	nameTemp =  '%s.%s' % (todayDate,"txt")
	createFile(nameTemp, weather, 1)
	pd = subprocess.Popen(["pd","-nogui","Audio.pd"])
	t.sleep(120)
	pd.send_signal(signal.SIGINT)

	nameTemp = '%s.%s' % (todayDate, "mp3")
	subprocess.call(["ffmpeg","-i","audio.wav", nameTemp])


if __name__=='__main__':
	main()