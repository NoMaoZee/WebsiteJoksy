<!-- <?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Koneksi ke database
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'joksky';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Menentukan metode request
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Mengambil data service
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM services WHERE id=$id";
        } else {
            $sql = "SELECT * FROM services";
        }
        $result = $conn->query($sql);
        if ($result) {
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(["error" => "Failed to fetch services"]);
        }
        break;

    case 'POST': // Menambahkan data service
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $conn->real_escape_string($input['name']);
        $price = $conn->real_escape_string($input['price']);
        $image = $conn->real_escape_string($input['image']);
        $sql = "INSERT INTO services (name, price, image) VALUES ('$name', '$price', '$image')";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Service added successfully"]);
        } else {
            echo json_encode(["error" => "Failed to add service"]);
        }
        break;

    case 'PUT': // Mengupdate data service
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id']);
        $name = $conn->real_escape_string($input['name']);
        $price = $conn->real_escape_string($input['price']);
        $image = $conn->real_escape_string($input['image']);
        $sql = "UPDATE services SET name='$name', price='$price', image='$image' WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Service updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update service"]);
        }
        break;

    case 'DELETE': // Menghapus data service
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id']);
        $sql = "DELETE FROM services WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Service deleted successfully"]);
        } else {
            echo json_encode(["error" => "Failed to delete service"]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

$conn->close();
?> -->