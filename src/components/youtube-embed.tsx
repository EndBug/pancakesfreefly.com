interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YoutubeEmbed({
  videoId,
  title = "YouTube video",
  className = "",
}: YoutubeEmbedProps) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div className={`aspect-video w-full max-w-3xl ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
