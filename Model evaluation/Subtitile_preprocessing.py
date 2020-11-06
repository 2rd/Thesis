import re
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
from nltk import word_tokenize
import nltk
import os
import srt
import pickle
nltk.download('punkt')
nltk.download('stopwords')

dir = ''
subs = dict()
patterns = ['http\S+', '\S*@\S*\s?', '[^a-zA-Z]', '\d+']


# Remove stop words from a tokenized string
def remove_stopwords(tokens):
    stop_w = set(stopwords.words('english'))
    without_stopwords = []

    for w in tokens:
        if not w in stop_w:
            without_stopwords.append(w)
        else:
          print(w)

    return without_stopwords


# Apply stemming to a tokenized string
def stem(tokens):
    stemmer = SnowballStemmer("english")
    stemmed = []

    for w in tokens:
        stemmed.append(stemmer.stem(w))

    return stemmed

def remove_patterns(text, patterns=patterns):
    for pattern in patterns:
        text = re.sub(pattern, ' ', text)
    return text

def remove_shortwords(tokens):
  updated_tokens = []
  for word in tokens:
    if len(word) > 2:
      updated_tokens.append(word)
  return updated_tokens

def clean_subs(subs_dict):
    for movie in subs_dict.keys():
        cleaned = remove_patterns(subs_dict[movie])
        cleaned = word_tokenize(cleaned)
        cleaned = remove_stopwords(cleaned)
        cleaned = stem(cleaned)
        cleaned = remove_stopwords(cleaned)
        cleaned = remove_shortwords(cleaned)
        subs_dict[movie] = cleaned
    return subs_dict


def subfile_to_string(subfile):
    sub_generator = srt.parse(subfile)
    subtitles = list(sub_generator)
    subtitles.pop(0)
    subtitles.pop(len(subtitles) - 1)
    sub_string = ''
    for i in range(len(subtitles)):
        sub_string += subtitles[i].content
    return sub_string

# Create dict with subtitles
for sub in os.listdir(dir):
  infile = open(f'{dir}/{sub}', 'rt', encoding='iso-8859-1')
  subs[sub] = subfile_to_string(infile)
  infile.close()


subs = clean_subs(subs)

pickle.dump(subs, (open(".p", "wb")))