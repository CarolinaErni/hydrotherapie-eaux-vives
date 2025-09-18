VIDEOIN=../static/videos/GettyImages-1655701480.mp4
VIDEOUT=../static/videos/GettyImages-1655701480-warm.mp4

if [ ! -f "$VIDEOIN" ]; then
    echo "Error: Video file not found at $VIDEOIN"
    exit 1
fi

ffmpeg -y -i "$VIDEOIN" \
-vf "eq=brightness=0.07:saturation=1.4,colorbalance=rs=.4:gs=.15:bs=-.25,hqdn3d=1.5:1.5:6:6" \
-c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p \
-c:a copy "$VIDEOUT"
