export class ContainerCredentialsStorage {

    static store(username, password) {
        if (window.PasswordCredential) {
			var passwordCredential = new PasswordCredential({
				id: username,
				password: password
			});
			return navigator.credentials.store(passwordCredential);
        }
        return Promise.resolve();
    }

}