import TabsFalsas from '@/components/tabs';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ProfilePage = () => {
    // Datos de ejemplo del perfil (puedes reemplazar con datos reales)
    const [profile, setProfile] = useState({
        name: 'John Doe',
        username: 'johndoe123',
        bio: 'Desarrollador de software y amante de los animales.',
        profileImage: '/assets/images/animals/30.png', // Reemplaza con la URL de la imagen del perfil
        followers: 123,
        following: 456,
        posts: 1,
    });

    return (<>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('@/assets/images/animals/29.png')} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.username}>@{profile.username}</Text>
                    <Text style={styles.bio}>{profile.bio}</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{profile.followers}</Text>
                    <Text style={styles.statLabel}>Seguidores</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{profile.following}</Text>
                    <Text style={styles.statLabel}>Siguiendo</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{profile.posts}</Text>
                    <Text style={styles.statLabel}>Publicaciones</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            {/* Puedes agregar aquí más componentes para mostrar las publicaciones del usuario, etc. */}
        </ScrollView>
        <TabsFalsas></TabsFalsas>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    username: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 16,
        color: 'gray',
    },
    editProfileButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    editProfileButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfilePage;