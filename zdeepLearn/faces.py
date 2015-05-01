import optparse
import cv2,cv,os
from sys import argv
from scipy.misc import imread

#Begin Options
parser = optparse.OptionParser()

parser.add_option('-f', '--filedir',
    action="store", dest="filedir",
    help="filedir for image processing", default="filedir")

parser.add_option('-o', '--outputdir',
    action="store", dest="outputdir",
    help="output dir for output files", default="")

parser.add_option('-i', '--ignorefiles',
    action="store", dest="filtertypes",
    help="ignore file types, takes a comma separated list of regex strings", default="filtertypes")

options, args = parser.parse_args(argv)

startdir = options.filedir
outputdir = options.outputdir
filtertypes = options.filtertypes
filtertypes = filtertypes.split(",")

#End Options

#This needs to point to whatever the local classifier is
facepath = '/Users/Tyche/anaconda/pkgs/opencv-2.4.8-np17py27_2/share/OpenCV/haarcascades/haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(facepath)

allFiles = []
for root, dirs, files in os.walk(startdir+"/"):
    allFiles += [os.path.join(root, name) for name in files if ".jpg" in name]

noFaces,Faces = [],[]


for f in allFiles:
    gray = cv2.cvtColor(cv2.imread(f),cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5,minNeighbors=6)
    if len(faces) == 0:
        noFaces.append(f)
    else:
        Faces.append(f)

f = open(outputdir +"/nofaces.txt",'w')
for res in noFaces:
    f.writelines(res+"\n")
f.close()

f = open(outputdir +"/faces.txt",'w')
for res in Faces:
    f.writelines(res+"\n")
f.close()