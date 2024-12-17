#include <stdio.h>
#include <stdlib.h>

// Define the structure for the node
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

// Function to create a new node
struct Node* createNode(int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

// Function to insert a node in the BST
struct Node* insertNode(struct Node* root, int data) {
    if (root == NULL) {
        root = createNode(data);
        return root;
    }

    if (data < root->data) {
        root->left = insertNode(root->left, data);
    } else if (data > root->data) {
        root->right = insertNode(root->right, data);
    }

    return root;
}

// Function to search a node in the BST
struct Node* searchNode(struct Node* root, int key) {
    if (root == NULL || root->data == key)
        return root;

    if (key < root->data)
        return searchNode(root->left, key);

    return searchNode(root->right, key);
}

// Function to find the minimum value node in the BST
struct Node* findMin(struct Node* node) {
    struct Node* current = node;
    while (current && current->left != NULL)
        current = current->left;
    return current;
}

// Function to delete a node from the BST
struct Node* deleteNode(struct Node* root, int key) {
    if (root == NULL)
        return root;

    if (key < root->data) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->data) {
        root->right = deleteNode(root->right, key);
    } else {
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }

        struct Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }

    return root;
}

// Function to perform in-order traversal
void inorderTraversal(struct Node* root) {
    if (root != NULL) {
        inorderTraversal(root->left);
        printf("%d ", root->data);
        inorderTraversal(root->right);
    }
}

// Main function to test the BST implementation
int main() {
    struct Node* root = NULL;
    root = insertNode(root, 50);
    root = insertNode(root, 30);
    root = insertNode(root, 20);
    root = insertNode(root, 40);
    root = insertNode(root, 70);
    root = insertNode(root, 60);
    root = insertNode(root, 80);

    printf("Inorder traversal of the BST: ");
    inorderTraversal(root);
    printf("\n");

    printf("Deleting node 20\n");
    root = deleteNode(root, 20);
    printf("Inorder traversal after deletion: ");
    inorderTraversal(root);
    printf("\n");

    printf("Searching for node with value 60\n");
    struct Node* searchResult = searchNode(root, 60);
    if (searchResult != NULL) {
        printf("Node found with value: %d\n", searchResult->data);
    } else {
        printf("Node not found\n");
    }

    return 0;
}
