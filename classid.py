#Written by Aaron Längert
import sys;
import re;
import json;
import string;
import codecs;


print("Written by Aaron Längert\n");
if(len(sys.argv)) == 1:
	print("\nUsage: python " + sys.argv[0] + " <file> [file] [file]");
	exit();

blacklist = [];
try:
	file = open("classid-ignore.json");
	try:
		blacklist = json.load(file);
		file.close();
		print("Found classid-ignore.json file!");
	except:
		print("Oops.. something seems wrong with your classid-ignore file :/");
except:
	print("You can exclude ids and classes by specifying them in classid-ignore.json. See the documentation for more information.");


values = {};
alphabet = "a";
counter = 0;
savepairs = False;
totalsave = 0;


def countup():
	global counter;
	global alphabet;
	if counter == 51:
		counter = 0;
	else:
		counter += 1;
	if counter > 0:
		alphabet = alphabet[:-1];

	alphabet += string.ascii_letters[counter: counter + 1];


for fle in sys.argv[1:]:
	if(fle == "--save-pairs"):
		savepairs = True;
		break;
	typ = str(fle.rsplit(".", 1)[-1]);
	if (typ == "html") or (typ == "js") or (typ == "css"):
		try:
			file = codecs.open(fle, "r+", "utf-8");
			content = file.read();
		except:
			print("Can't open file " + fle + ": " + str(sys.exc_info()[0]));
			break;
		print("shortening " + fle + "..");

		splitter = extractor = '.+';
		if (typ == "html"):
			mask = ['(?<=class=")[^"]+', '(?<=id=")[^"]+'];
			splitter = '[^ ]+';
		if (typ == "js"):
			mask = ['classid\("[^")]+"\)'];
			extractor = '(?<=").[^"]+';
		if (typ == "css"):
			mask = ['(?<=\.)-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?!\s)*', '(?<=#)-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)'];

		for regex in mask:
			matches = re.finditer(regex, content, re.M);
			sparing = 0;
			for match in matches:
				parts = re.finditer(splitter, match.group(0));
				for classid in parts:
					core = re.search(extractor, classid.group(0));
					if (core.group(0) in blacklist) and (typ != "js"):
						break;
					elif core.group(0) in blacklist:
						replacewith = core.group(0);
					elif core.group(0) in values:
						replacewith = values.get(core.group(0));
					else:
						replacewith = alphabet;
						values[core.group(0)] = alphabet;
						countup();

					if typ == "js":
						replacewith = "\"" + replacewith + "\"";
						totalsave -= 9; #the chracters from classid() technically don't count

					start = match.start(0) + classid.start(0) - sparing;
					end = match.start(0) + classid.end(0) - sparing;
					sparing += end - start - len(replacewith);

					content = content[:start] + replacewith + content[end:];
			totalsave += sparing;

		file.seek(0);
		file.write(content);
		file.truncate();
		file.close();
	else:
		print("Unknown file type: " + typ);

if savepairs:
	file = open("classid-pairs.json", "w");
	file.write(str(values).replace("'", "\""));
	file.close();
	print("Saved pairs of ids/classes to classid-pairs.json!");
	
print("\n\nDONE! Saved " + str(totalsave) + " characters (~" + str(totalsave / 1000) + "KB) in total");