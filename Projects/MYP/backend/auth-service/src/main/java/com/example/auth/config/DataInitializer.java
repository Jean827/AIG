import com.example.auth.entity.Permission;
import com.example.auth.entity.Role;
import com.example.auth.repository.PermissionRepository;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 初始化角色
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            adminRole.setDescription("Administrator role with full access");
            roleRepository.save(adminRole);
        }

        if (!roleRepository.existsByName("ROLE_USER")) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            userRole.setDescription("Regular user role with limited access");
            roleRepository.save(userRole);
        }

        // 初始化权限
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();

        if (!permissionRepository.existsByName("USER_CREATE")) {
            Permission createUser = new Permission();
            createUser.setName("USER_CREATE");
            createUser.setDescription("Permission to create users");
            createUser.setRole(adminRole);
            permissionRepository.save(createUser);
        }

        if (!permissionRepository.existsByName("USER_UPDATE")) {
            Permission updateUser = new Permission();
            updateUser.setName("USER_UPDATE");
            updateUser.setDescription("Permission to update users");
            updateUser.setRole(adminRole);
            permissionRepository.save(updateUser);
        }

        if (!permissionRepository.existsByName("USER_DELETE")) {
            Permission deleteUser = new Permission();
            deleteUser.setName("USER_DELETE");
            deleteUser.setDescription("Permission to delete users");
            deleteUser.setRole(adminRole);
            permissionRepository.save(deleteUser);
        }

        if (!permissionRepository.existsByName("ROLE_CREATE")) {
            Permission createRole = new Permission();
            createRole.setName("ROLE_CREATE");
            createRole.setDescription("Permission to create roles");
            createRole.setRole(adminRole);
            permissionRepository.save(createRole);
        }

        if (!permissionRepository.existsByName("ROLE_UPDATE")) {
            Permission updateRole = new Permission();
            updateRole.setName("ROLE_UPDATE");
            updateRole.setDescription("Permission to update roles");
            updateRole.setRole(adminRole);
            permissionRepository.save(updateRole);
        }

        if (!permissionRepository.existsByName("ROLE_DELETE")) {
            Permission deleteRole = new Permission();
            deleteRole.setName("ROLE_DELETE");
            deleteRole.setDescription("Permission to delete roles");
            deleteRole.setRole(adminRole);
            permissionRepository.save(deleteRole);
        }
    }
}