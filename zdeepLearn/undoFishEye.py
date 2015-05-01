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

#Camera Matrix Settings - adapted from http://stackoverflow.com/users/128966/jmbr
intrinsics = cv.CreateMat(3, 3, cv.CV_64FC1)
cv.Zero(intrinsics)
intrinsics[0, 0] = float(7000)#float(4300)
intrinsics[1, 1] = float(4500)#float(3200)
intrinsics[2, 2] = 1.0
intrinsics[0, 2] = float(4384/2)
intrinsics[1, 2] = float(3288/2)

dist_coeffs = cv.CreateMat(1, 4, cv.CV_64FC1)
cv.Zero(dist_coeffs)
dist_coeffs[0, 0] = float(-1)
dist_coeffs[0, 1] = float(-1)#loat(0.0193617)
dist_coeffs[0, 2] = float(-.1)#float(-0.002004) 
dist_coeffs[0, 3] = float(-.1)#float(-0.002056)
#End Camera Matrix

allFiles = []
for root, dirs, files in os.walk(startdir+"/"):
    allFiles += [os.path.join(root, name) for name in files if ".jpg" in name]


for im in allFiles:

	#src = "2015-03-07 11.07.16.jpg"
	src = cv.LoadImage(im)
	size = cv.GetSize(src)
	s = (int(size[0]*0.9), int(size[1]*0.9))
	
	res = cv.CreateImage(s, src.depth, src.nChannels)
	im1, im2 = cv.CreateImage(s, cv.IPL_DEPTH_32F, 1),cv.CreateImage(s, cv.IPL_DEPTH_32F, 1)

	cv.InitUndistortMap(intrinsics, dist_coeffs, im1, im2)
	cv.Remap(src, res, im1, im2, cv.CV_INTER_LINEAR + cv.CV_WARP_FILL_OUTLIERS,  cv.ScalarAll(0))
	print im.strip(".jpg")+"_nodistort.jpg"
	cv.SaveImage(im.strip(".jpg")+"_nodistort.jpg",res)  

