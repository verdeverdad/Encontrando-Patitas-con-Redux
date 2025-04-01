buildscript {
    repositories {
        google() // Repositorio de Google
        mavenCentral() // Repositorio Maven Central
    }

    dependencies {
        // Clase necesaria para Google Services
        classpath("com.google.gms:google-services:4.4.2")
    }
}

plugins {
    id("com.android.application")
    id("com.google.gms.google-services") // Plugin de Google Services
    kotlin("android") // Si estás usando Kotlin
}

android {
    compileSdk = 33

    defaultConfig {
        applicationId = "com.example.encontrandopatitas"
        minSdk = 21
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation("com.google.firebase:firebase-database-ktx:20.2.2") // Firebase Realtime Database
    implementation("com.google.firebase:firebase-analytics-ktx:21.2.0") // Firebase Analytics
    implementation("androidx.core:core-ktx:1.10.1")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.9.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")
}

// Aplica el plugin de Google Services
apply(plugin = "com.google.gms.google-services")