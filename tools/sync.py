"""
Connexion avec clé SSH
https://www.infomaniak.com/fr/support/faq/2054/se-connecter-avec-cle-ssh
"""

import subprocess
import os
from rich import print

what_paths_to_sync = [
    "photographe_christian_bromley",
]

all_paths_to_sync = {
    "photographe_christian_bromley": {
        "cmd": "rsync",
        "options": "-avz",
        "sources": [
            "../stock/images/photographe_christian_bromley-nogit/",
        ],
        "destination": "7x8el_nico@7x8el.ftp.infomaniak.com:sites/ernicarolina.ch/photographe_christian_bromley/",
    },
}


def do_sync(path):

    command = [
        path["cmd"],
        path["options"],
        " ".join(path["sources"]),
        path["destination"],
    ]

    print(" \\\n   ".join(command))
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    print(result.stdout.strip())


def main(all_paths_to_sync, what_paths_to_sync):
    for path_to_sync in what_paths_to_sync:
        path = all_paths_to_sync[path_to_sync]
        do_sync(path)


if __name__ == "__main__":
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        main(all_paths_to_sync, what_paths_to_sync)
    except KeyboardInterrupt:
        print("\nSynchronisation interrompue par l’utilisateur.")
    except subprocess.CalledProcessError as e:
        print("Une erreur est survenue lors de la synchronisation :")
        print(e.stderr)
    else:
        print("\n✅ Synchronisation terminée avec succès!")
