# README ANSIBLE

![ansible](./ansible.jpg)
## Installation Ansible

Pour (Ubuntu), lancer les commandes suivantes :
```
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```

## Modules Ansible

Tous les modules et documentations technique est disponible [ici](https://docs.ansible.com/ansible/2.8/modules/modules_by_category.html).

## Fichier playbook

Un playbooks Ansible est un fichier YAML dans lesquels sont mentionnés toutes les tâches qu'Ansible doit exécuter.
Il permet l'orchestration de toutes les étapes de déploiement d'une application ou d'une mise à jour sur celui-ci.

Exemple:
```
---
- name: Installation des serveurs web
  hosts: SERVEUR-WEB
  remote_user: root

  tasks: 
    - name: Installation de Git
       apt: name=git state=latest

- name: Installation des serveurs bdd
  hosts: SERVEUR-BDD
  remote_user: root

  tasks: 
    - name: Installation de Mariadb
       apt: name=mariadb state=latest
...
```

## Fichier hosts

Permet de créer des groupes de serveurs en fonction du déploiement voulu.

Exemple :
```
[SERVEUR-WEB]
192.X.X.X
192.X.X.X
192.X.X.X

[SERVEUR-BDD]
192.X.X.X
192.X.X.X
192.X.X.X
```
## Les dossiers roles

Afin de mieux organiser les taches, on peut les séparés en plusieur roles afin de pouvoir les réutiliser plus simplement.

```
roles
 |-- <nom du role>
           |--- tasks
                  |--- main.yml
                  |--- installation.yml 
                  |--- configuration.yml 
           |--- handlers
                  |--- main.yml
           |--- defaults
                  |--- main.yml
```
* Le dossier tasks va contenir les taches, le fichier main.yml sera chargé par défaut et peut inclure d'autres fichiers de taches via un include.
* Le dossier handlers va contenir des taches à effectuer lors de la réussite d'autres taches (comme le redémarrage d'nginx par exemple).
* Le dossier defaults va contenir les variable par défaut pour ce role. Ces variables peuvent être modifiées dans le playbook qui chargera ce role.

## Les dossiers handlers

Les handlers permettent de gérer des taches qui doivent être effectuées en cas de changement d'une tache précédente.

Exemple : Recharger un service après une modification de la configuration.

## Les variables

Des variables peuvent aussi être utilisé dans des templates. Par exemple on souhaite créer une configuration nginx modulable.

## Exécuter un playbook sur le serveur ansible

Connectez-vous sur votre serveur ansible , aller dans le répertoire ou ce situe votre playbook puis éxécuter la commande suivante :

```
ansible-playbook -i hosts playbook.yml
```