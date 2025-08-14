import lombok.Data;

@Data
public class PermissionDTO {
    private Long id;
    private String name;
    private String description;
    private Long roleId;
}