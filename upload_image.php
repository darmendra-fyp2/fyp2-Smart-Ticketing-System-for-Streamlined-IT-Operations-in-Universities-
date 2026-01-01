<?php
header('Content-Type: application/json');

$targetDir = "uploads/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if(isset($_FILES['ticketImage'])) {
    $fileName = time() . "_" . basename($_FILES['ticketImage']['name']);
    $targetFilePath = $targetDir . $fileName;

    if(move_uploaded_file($_FILES['ticketImage']['tmp_name'], $targetFilePath)) {
        echo json_encode(["success"=>true, "imageUrl"=>$targetFilePath]);
    } else {
        echo json_encode(["success"=>false, "error"=>"Failed to upload image"]);
    }
} else {
    echo json_encode(["success"=>false, "error"=>"No file sent"]);
}
?>
