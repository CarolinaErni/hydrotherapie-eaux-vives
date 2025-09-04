
HTMLFILE=index.html
CSSFILE=style.css
UNCSSFILE=style_uncss.css

uncss $HTMLFILE -s $CSSFILE > $UNCSSFILE

mv $UNCSSFILE $CSSFILE