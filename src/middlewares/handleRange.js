const handleRange = (req, file, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(416).send('Range Not Satisfiable');
        return null;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    const chunksize = (end - start) + 1;

    const head = {
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg', // Asegúrate de que el tipo de contenido sea correcto
    };
    res.writeHead(206, head);

    return { start, end };
};

export default handleRange;
