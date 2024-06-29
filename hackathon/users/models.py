from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, user_id, user_email, user_name, password=None):
        if not user_email:
            raise ValueError('Users must have an email address')
        if not user_id:
            raise ValueError('Users must have a user ID')
        user = self.model(
            user_id=user_id,
            user_email=self.normalize_email(user_email),
            user_name=user_name,
        )
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id,user_email, user_name, password):
        user = self.create_user(
            user_id=user_id,
            user_email=user_email,
            user_name=user_name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    user_id=models.CharField(max_length=10,verbose_name="아이디",unique=True)
    user_email = models.EmailField(
        verbose_name='이메일',
        max_length=100,
        unique=True,
    )
    
    user_name = models.CharField(max_length=30,verbose_name="이름")

    objects = UserManager()

    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = ['user_email','user_name']

    def __str__(self):
        return self.user_id

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    @property
    def is_staff(self):
        return self.is_admin

    class Meta:
        db_table = 'user'


class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    profile_bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.user_name
