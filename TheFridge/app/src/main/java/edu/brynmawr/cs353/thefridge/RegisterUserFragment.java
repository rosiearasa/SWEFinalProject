package edu.brynmawr.cs353.thefridge;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

/**
 * this class uses the fragment_registeruser.xml to set up the layout for entering the user information
 *
 */

public class RegisterUserFragment extends AppCompatActivity {

    String user = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.fragment_registeruser);
        }
    }

