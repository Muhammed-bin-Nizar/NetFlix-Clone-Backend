import pool from "../db/index.js"



const createNewPlaylistInDb = async (data) => {
    const { name, owner_id } = data

    const [result] = await pool.query(`INSERT INTO playlists (owner_id,name) VALUES (?,?)`, [owner_id, name])
    console.log(result)
    return result
}


const addVideoToPlaylistInDb = async (data) => {
    const { videoId, playlistId } = data

    // Get the next position
    const [maxRows] = await pool.query(
        `SELECT MAX(position) as max_pos FROM playlist_videos WHERE playlist_id = ?`,
        [playlistId]
    )

    const nextPosition = maxRows[0].max_pos ? maxRows[0].max_pos + 1 : 1

    // Insert video into playlist
    const [result] = await pool.query(
        `INSERT INTO playlist_videos (playlist_id, video_id, position) VALUES (?, ?, ?)`,
        [playlistId, videoId, nextPosition]
    )

    //  Update playlist timestamp
    // await pool.query(
    //     `UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    //     [playlistId]
    // )

    // Get the created playlist_video record
    const [rows] = await pool.query(
        `SELECT * FROM playlist_videos WHERE id = ?`,
        [result.insertId]
    )

    return rows[0]
}


const findByIdAndGetAllPlaylistVideos = async (playlistId) => {
    const [result] = await pool.query(`
        SELECT 
            v.id,
            v.title,
            v.description,
            v.thumbnail,
            v.videoFile,
            v.views,
            v.owner,
            v.isPublished,
            v.duration,
            v.createdAt,
            v.updatedAt,
            pv.id as playlist_video_id,
            pv.position,
            pv.added_at,
            u.id as owner_id,
            u.username as owner_username,
            u.fullName as owner_fullName,
            u.avatar as owner_avatar
        FROM videos v
        INNER JOIN playlist_videos pv ON v.id = pv.video_id
        LEFT JOIN users u ON v.owner = u.id
        WHERE pv.playlist_id = ?
        ORDER BY pv.position ASC
    `, [playlistId])

    return result
}

const getByIdAndRemoveVideo = async (data) => {
    const { playlistId, videoId, userId } = data

    const [result] = await pool.query(
        `DELETE playlist_videos FROM playlist_videos
         INNER JOIN playlists ON playlist_videos.playlist_id = playlists.id
         WHERE playlist_videos.playlist_id = ? 
         AND playlist_videos.video_id = ? 
         AND playlists.owner_id = ?`, 
        [playlistId, videoId, userId]
    )
    
    return result.affectedRows > 0 ? result : null
}

const deletePlaylistFromDb = async (data) =>{
    const {playlistId,userId} = data

    const [result] = await pool.query(`DELETE FROM playlists WHERE id = ? AND owner_id = ?`,[playlistId,userId])

    return result

}

const getUserPlaylistsFromDb = async(userId)=>{
    

    const [result] = await pool.query(`SELECT * FROM playlists WHERE owner_id=?`,[userId]) 
    
    console.log(result)
    return result
}




export {
    createNewPlaylistInDb,
    addVideoToPlaylistInDb,
    findByIdAndGetAllPlaylistVideos,
    getByIdAndRemoveVideo,
    deletePlaylistFromDb,
    getUserPlaylistsFromDb
}









// CREATE TABLE playlists (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     owner_id INT NOT NULL,
//     name VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
//     INDEX idx_owner_id (owner_id)
// );


// CREATE TABLE playlist_videos (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     playlist_id INT NOT NULL,
//     video_id INT NOT NULL,
//     position INT NOT NULL,
//     added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
//     FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
//     UNIQUE KEY unique_playlist_video (playlist_id, video_id),
//     INDEX idx_playlist_position (playlist_id, position)
// );


