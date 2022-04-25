package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void registerUserButtonClick(View v) {
        Intent intent = new Intent (this, RegisterUserFragment.class);
        startActivity(intent);
    }

    public void onSignIn(View v) {
        Intent intent = new Intent (this, HomePageActivity.class);

        EditText signInNameView = (EditText) findViewById(R.id.name);
        EditText signInRoomView = (EditText) findViewById(R.id.roomNumber);
        String user = signInNameView.getText().toString() + " (" + signInRoomView.getText().toString() + ")";

        intent.putExtra("user", user);
        startActivity(intent);
    }

}