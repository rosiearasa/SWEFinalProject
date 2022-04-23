package edu.brynmawr.cs353.thefridge;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MyItems extends AppCompatActivity {

    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.activity_my_items);
    }

}
