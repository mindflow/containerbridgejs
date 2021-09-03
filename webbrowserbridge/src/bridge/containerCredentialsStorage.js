export class ContainerCredentialsStorage {

    static store(username, password) {
        if (window.PasswordCredential) {
			const passwordCredential = new PasswordCredential({
				id: username,
				password: password
            });

            //const passwordCredentialsData = new CredentialCreationOptions();
			return navigator.credentials.store(passwordCredential).then((credential) => {
                LOG.info(credential);
            });
        }
        return Promise.resolve();
    }

}