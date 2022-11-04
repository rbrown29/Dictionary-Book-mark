javascript: (
    void (
        function () {
            var fileRef;

            var loaded = false;

            try {
                loaded = lookupDictDefinition;
            } catch (error) {

            }
            if (!loaded) {
                fileRef = document.createElement('link');
                fileRef.rel = 'stylesheet';
                fileRef.type = 'text/css';
                fileRef.href = 'https://localhost/CIS233W/lab5/dict/dict.css';
                document.getElementsByTagName("head")[0].appendChild(fileRef);

                fileRef = document.createElement('script');
                fileRef.src = 'https://localhost/CIS233W/lab5/dict/dict.js';
                fileRef.type = 'text/javascript';
                document.getElementsByTagName("head")[0].appendChild(fileRef);
            } else {
                lookupDictDefinition();
            }
        }()
    )
)