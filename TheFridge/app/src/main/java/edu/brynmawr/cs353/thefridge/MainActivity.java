package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void registerUserButtonClick(View v) {
        Intent intent = new Intent (this, RegisterUserFragment.class);
        //intent.putExtra("user", user);
        startActivity(intent);
    }

}