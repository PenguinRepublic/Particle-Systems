import os
import sys

fout = open('index.html', 'w')

def buildIndex(root_folder = os.getcwd()):
	rootLength, t = len(root_folder), []
	for root, dir, files in os.walk(root_folder):
		if '.git' not in root and len(root) > rootLength:
			t.append(root[rootLength:])
	return t

def printBody(t):
	for s in t:
		formattedString = '''
		<a href="''' + s[1:] + '''/index.html" class="list-group-item">
			<span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
			''' + s[1:] + '''
		</a>'''
		fout.write(formattedString)


def printHeader():
	header = '''
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<title>Particle System</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
</head>
<body>
	<h1>Particle Systems!!</h1>
	<div class="list-group">'''
	fout.write(header)


def printFooter():
	footer = '''
	</div>

	<!-- Bootstrap -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
</body>
</html>'''
	fout.write(footer)


printHeader()
printBody(buildIndex())
printFooter()