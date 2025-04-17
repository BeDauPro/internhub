using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class AzureBlobService
{
    private readonly string _connectionString;
    private readonly string _containerName;

    public AzureBlobService(IConfiguration configuration)
    {
        _connectionString = configuration["AzureBlobStorage:ConnectionString"];
        _containerName = configuration["AzureBlobStorage:ContainerName"];
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var blobClient = containerClient.GetBlobClient(fileName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
            }

            return blobClient.Uri.ToString();
        }
        catch (Exception ex)
        {
            // Log the error (you can replace this with your logging mechanism)
            Console.Error.WriteLine($"Error uploading file to Azure Blob Storage: {ex.Message}");
            return string.Empty; // Return an empty string if the upload fails
        }
    }

    public async Task DeleteFileIfExistsAsync(string fileUrl)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

            string blobName = Path.GetFileName(new Uri(fileUrl).AbsolutePath);
            var blobClient = containerClient.GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to delete blob: {ex.Message}");
        }
    }

}
